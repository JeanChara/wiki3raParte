#!/usr/bin/perl

use DBI;
use CGI;
use strict;
use warnings;

# recibimos parametros
my $q = CGI->new;
my $owner = $q->param("usuario");
my $titulo = $q->param("titulo");
my $markdown = $q->param("cuerpo");

#conectamos base de datos
my $user = 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.6";
my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");

my $sth = $dbh->prepare("SELECT * FROM Users WHERE userName=?");
$sth->execute($owner);
my @row = $sth->fetchrow_array;

print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

if (!(@row == 0)){
	# si existe un usuario con el nombre dado...
	my @titulos;
	my $sth = $dbh->prepare("SELECT title FROM Articles WHERE owner=?");
	$sth->execute($owner);

	while( my @row2 = $sth->fetchrow_array ) {
		push (@titulos,@row2);
	}

	if(@titulos[0]eq($titulo)){
	my $sth1 = $dbh->prepare ("UPDATE Articles SET markdown=? WHERE title=? AND owner=?");
	$sth1->execute($markdown,$titulo,$owner);
	$sth1->finish;
	}
	else{
	my $sth2 = $dbh->prepare("INSERT INTO Articles (title,owner,markdown) VALUES (?,?,?)");
	$sth2->execute($titulo,$owner,$markdown);
	$sth2->finish;
	}
	$sth->finish;

	print "<article>";
	print "<tittle> $titulo </tittle>";
	print "<text> $markdown </text>";
	print "</article>";
}
else {
	print "<article>";
	print "<tittle></tittle>";
	print "<text></text>";
	print "</article>";
	
}
$dbh->disconnect;
